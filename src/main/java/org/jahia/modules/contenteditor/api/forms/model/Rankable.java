//package org.jahia.modules.contenteditor.api.forms.model;
//
//public interface Rankable extends Comparable<Rankable> {
//    Double rank = null;
//
//    default Double getRank() {
//        return rank;
//    }
//
//    default void setRank(Double rank) {
//        this.rank = rank;
//    }
//
//    @Override
//    default int compareTo(Rankable other) {
//        if (other == null || other.getRank() == null) {
//            return -1;
//        }
//
//        if (rank == null) {
//            return 1;
//        }
//
//        if (!rank.equals(other.getRank())) {
//            return rank.compareTo(other.getRank());
//        }
//        return name.compareTo(other.getName());
//    }
//}
